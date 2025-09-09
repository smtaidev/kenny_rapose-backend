import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//=====================Get Tour Booking Statistics=====================
const getTourBookingStats = async () => {
  // Get total successful tour bookings (payment succeeded)
  const totalBookings = await prisma.tourBooking.count({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    }
  });

  // Get total revenue from successful tour bookings
  const revenueResult = await prisma.tourBooking.aggregate({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    },
    _sum: {
      totalAmount: true
    }
  });

  // Get bookings by status
  const bookingsByStatus = await prisma.tourBooking.groupBy({
    by: ['status'],
    _count: {
      id: true
    },
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    }
  });

  // Get recent bookings (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentBookings = await prisma.tourBooking.count({
    where: {
      payment: {
        status: 'SUCCEEDED'
      },
      createdAt: {
        gte: thirtyDaysAgo
      }
    }
  });

  // Get monthly breakdown (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyBreakdown = await prisma.tourBooking.groupBy({
    by: ['createdAt'],
    _count: {
      id: true
    },
    _sum: {
      totalAmount: true
    },
    where: {
      payment: {
        status: 'SUCCEEDED'
      },
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return {
    totalBookings,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    recentBookings,
    bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>),
    monthlyBreakdown: monthlyBreakdown.map(item => ({
      month: item.createdAt.toISOString().substring(0, 7), // YYYY-MM format
      count: item._count.id,
      revenue: item._sum.totalAmount || 0
    }))
  };
};

//=====================Get AI Credit Purchase Statistics=====================
const getAiCreditStats = async () => {
  // Get total successful AI credit purchases
  const totalPurchases = await prisma.creditPurchase.count({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    }
  });

  // Get total revenue from AI credit purchases
  const revenueResult = await prisma.creditPurchase.aggregate({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    },
    _sum: {
      amountPaid: true
    }
  });

  // Get total credits sold
  const totalCreditsSold = await prisma.creditPurchase.aggregate({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    },
    _sum: {
      creditsPurchased: true
    }
  });

  return {
    totalPurchases,
    totalRevenue: revenueResult._sum.amountPaid || 0,
    totalCreditsSold: totalCreditsSold._sum.creditsPurchased || 0
  };
};

//=====================Get Wallet Top-up Statistics=====================
const getWalletStats = async () => {
  // Get total successful wallet top-ups
  const totalTopUps = await prisma.breezeWalletPurchase.count({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    }
  });

  // Get total revenue from wallet top-ups
  const revenueResult = await prisma.breezeWalletPurchase.aggregate({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    },
    _sum: {
      amountPaid: true
    }
  });

  // Get total wallet amount purchased
  const totalWalletAmount = await prisma.breezeWalletPurchase.aggregate({
    where: {
      payment: {
        status: 'SUCCEEDED'
      }
    },
    _sum: {
      amountPurchased: true
    }
  });

  return {
    totalTopUps,
    totalRevenue: revenueResult._sum.amountPaid || 0,
    totalWalletAmount: totalWalletAmount._sum.amountPurchased || 0
  };
};

//=====================Get Users by Country Statistics=====================
const getUsersByCountry = async () => {
  const usersByCountry = await prisma.user.groupBy({
    by: ['country'],
    _count: {
      id: true
    },
    where: {
      country: {
        not: null
      }
    }
  });

  const totalUsers = await prisma.user.count();
  
  return usersByCountry.map(item => ({
    country: item.country || 'Unknown',
    count: item._count.id,
    percentage: totalUsers > 0 ? ((item._count.id / totalUsers) * 100).toFixed(2) : '0.00'
  }));
};

//=====================Get Tour Bookings per Month=====================
const getTourBookingsPerMonth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyBookings = await prisma.tourBooking.groupBy({
    by: ['createdAt'],
    _sum: {
      totalAmount: true
    },
    _count: {
      id: true
    },
    where: {
      payment: {
        status: 'SUCCEEDED'
      },
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return monthlyBookings.map(item => ({
    month: item.createdAt.toISOString().substring(0, 7), // YYYY-MM format
    amount: item._sum.totalAmount || 0,
    count: item._count.id
  }));
};

//=====================Get All Booked Tour Packages=====================
const getAllBookedTourPackages = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [bookedPackages, totalCount] = await Promise.all([
    prisma.tourBooking.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tourPackage: {
          select: {
            id: true,
            packageName: true,
            packageCategory: true,
            packagePriceAdult: true,
            packagePriceChild: true,
            packagePriceInfant: true,
            description: true,
            photos: true,
            citiesVisited: true,
            tourType: true,
            activities: true,
            highlights: true,
            about: true,
            ageRangeFrom: true,
            ageRangeTo: true,
            breezeCredit: true,
            status: true,
            star: true,
            createdAt: true,
            updatedAt: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            country: true
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            paymentIntentId: true,
            createdAt: true
          }
        }
      }
    }),
    prisma.tourBooking.count()
  ]);

  return {
    bookedPackages,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

//=====================Get Overall Dashboard Statistics=====================
const getDashboardStats = async () => {
  // Get total users count
  const totalUsers = await prisma.user.count();

  // Get total revenue from all sources
  const [tourRevenue, aiCreditRevenue, walletRevenue] = await Promise.all([
    prisma.tourBooking.aggregate({
      where: { payment: { status: 'SUCCEEDED' } },
      _sum: { totalAmount: true }
    }),
    prisma.creditPurchase.aggregate({
      where: { payment: { status: 'SUCCEEDED' } },
      _sum: { amountPaid: true }
    }),
    prisma.breezeWalletPurchase.aggregate({
      where: { payment: { status: 'SUCCEEDED' } },
      _sum: { amountPaid: true }
    })
  ]);

  const totalRevenue = (tourRevenue._sum.totalAmount || 0) + 
                     (aiCreditRevenue._sum.amountPaid || 0) + 
                     (walletRevenue._sum.amountPaid || 0);

  // Get last 30 days revenue
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [last30DaysTourRevenue, last30DaysAiCreditRevenue, last30DaysWalletRevenue] = await Promise.all([
    prisma.tourBooking.aggregate({
      where: { 
        payment: { status: 'SUCCEEDED' },
        createdAt: { gte: thirtyDaysAgo }
      },
      _sum: { totalAmount: true }
    }),
    prisma.creditPurchase.aggregate({
      where: { 
        payment: { status: 'SUCCEEDED' },
        createdAt: { gte: thirtyDaysAgo }
      },
      _sum: { amountPaid: true }
    }),
    prisma.breezeWalletPurchase.aggregate({
      where: { 
        payment: { status: 'SUCCEEDED' },
        createdAt: { gte: thirtyDaysAgo }
      },
      _sum: { amountPaid: true }
    })
  ]);

  const last30DaysRevenue = (last30DaysTourRevenue._sum.totalAmount || 0) + 
                          (last30DaysAiCreditRevenue._sum.amountPaid || 0) + 
                          (last30DaysWalletRevenue._sum.amountPaid || 0);

  // Get amounts for each category
  const totalTourBookingsAmount = tourRevenue._sum.totalAmount || 0;
  const totalAiCreditPurchasesAmount = aiCreditRevenue._sum.amountPaid || 0;
  const totalWalletTopUpsAmount = walletRevenue._sum.amountPaid || 0;

  // Get additional analytics
  const [usersByCountry, tourBookingsPerMonth] = await Promise.all([
    getUsersByCountry(),
    getTourBookingsPerMonth()
  ]);

  return {
    overview: {
      totalUsers,
      totalRevenue,
      last30DaysRevenue,
      totalTourBookings: totalTourBookingsAmount,
      totalAiCreditPurchases: totalAiCreditPurchasesAmount,
      totalWalletTopUps: totalWalletTopUpsAmount
    },
    usersByCountry,
    tourBookingsPerMonth
  };
};

//=====================Get Tour Package Analytics=====================
const getTourPackageAnalytics = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [tourPackages, totalCount] = await Promise.all([
    prisma.tourPackage.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      // Remove the deletedAt filter to show all packages including deleted ones
      include: {
        tourBookings: {
          include: {
            payment: true,
          },
        },
      },
    }),
    prisma.tourPackage.count()
  ]);

  const analytics = tourPackages.map((tourPackage) => {
    const bookings = tourPackage.tourBookings;
    
    // Calculate total bookings by status
    const statusCounts = {
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      refunded: bookings.filter(b => b.status === 'REFUNDED').length,
    };

    // Calculate total people booked
    const totalBookings = {
      adults: bookings.reduce((sum, b) => sum + b.adults, 0),
      children: bookings.reduce((sum, b) => sum + b.children, 0),
      infants: bookings.reduce((sum, b) => sum + b.infants, 0),
    };

    // Calculate earnings
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
    const pendingBookings = bookings.filter(b => b.status === 'PENDING');
    
    const totalEarnings = confirmedBookings.reduce((sum, b) => {
      return sum + (b.payment?.status === 'SUCCEEDED' ? b.totalAmount : 0);
    }, 0);

    const pendingAmount = pendingBookings.reduce((sum, b) => {
      return sum + (b.payment?.status === 'PENDING' ? b.totalAmount : 0);
    }, 0);

    // Calculate potential revenue based on pricing
    const totalPotentialRevenue = {
      adults: totalBookings.adults * tourPackage.packagePriceAdult,
      children: totalBookings.children * tourPackage.packagePriceChild,
      infants: totalBookings.infants * tourPackage.packagePriceInfant,
    };

    return {
      packageId: tourPackage.id,
      title: tourPackage.packageName,
      image: tourPackage.photos && tourPackage.photos.length > 0 ? tourPackage.photos[0] : null,
      currentStatus: tourPackage.status, // ACTIVE or INACTIVE
      isDeleted: tourPackage.deletedAt !== null, // Show if package is deleted
      deletedAt: tourPackage.deletedAt, // Show deletion date if deleted
      pricing: {
        adult: tourPackage.packagePriceAdult,
        child: tourPackage.packagePriceChild,
        infant: tourPackage.packagePriceInfant,
      },
      totalEarnings: totalEarnings,
      pendingAmount: pendingAmount,
      totalBookings: {
        adults: totalBookings.adults,
        children: totalBookings.children,
        infants: totalBookings.infants,
      },
      packageDuration: {
        startDate: tourPackage.startDay,
        endDate: tourPackage.endDay,
      },
      status: {
        confirmed: statusCounts.confirmed,
        pending: statusCounts.pending,
        cancelled: statusCounts.cancelled,
      },
    };
  });

  // Determine project current status based on business logic
  const activePackages = analytics.filter(pkg => pkg.currentStatus === 'ACTIVE' && !pkg.isDeleted).length;
  const deletedPackages = analytics.filter(pkg => pkg.isDeleted).length;
  const totalBookings = analytics.reduce((sum, pkg) => sum + pkg.totalBookings.adults + pkg.totalBookings.children + pkg.totalBookings.infants, 0);
  const totalEarnings = analytics.reduce((sum, pkg) => sum + pkg.totalEarnings, 0);
  
  let projectCurrentStatus = "ACTIVE";
  
  // Business logic to determine project status
  if (analytics.length === 0) {
    projectCurrentStatus = "INACTIVE"; // No packages available
  } else if (activePackages === 0) {
    projectCurrentStatus = "INACTIVE"; // No active packages
  } else if (totalBookings === 0 && totalEarnings === 0) {
    projectCurrentStatus = "PENDING"; // Project exists but no bookings yet
  } else if (activePackages < (analytics.length - deletedPackages) * 0.5) {
    projectCurrentStatus = "LIMITED"; // Less than 50% of non-deleted packages are active
  }

  // Calculate overall summary
  const summary = {
    totalPackages: analytics.length,
    totalBookings: totalBookings,
    totalEarnings: totalEarnings,
    totalPendingAmount: analytics.reduce((sum, pkg) => sum + pkg.pendingAmount, 0),
    projectCurrentStatus: projectCurrentStatus,
  };

  return {
    summary,
    packages: analytics,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
    },
  };
};

//=====================Get Cancel Request Statistics=====================
const getCancelRequestStats = async () => {
  const [totalCancelRequests, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
    prisma.cancelRequest.count(),
    prisma.cancelRequest.count({ where: { status: 'PENDING' } }),
    prisma.cancelRequest.count({ where: { status: 'APPROVED' } }),
    prisma.cancelRequest.count({ where: { status: 'REJECTED' } }),
  ]);

  // Get recent cancel requests (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentCancelRequests = await prisma.cancelRequest.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo
      }
    }
  });

  return {
    totalCancelRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    recentCancelRequests,
  };
};

//=====================Get All Cancel Requests with Details=====================
const getAllCancelRequestsWithDetails = async (page = 1, limit = 20, status?: string) => {
  const skip = (page - 1) * limit;
  
  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }

  const [cancelRequests, totalCount] = await Promise.all([
    prisma.cancelRequest.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            country: true,
          },
        },
        tourBooking: {
          include: {
            tourPackage: {
              select: {
                id: true,
                packageName: true,
                packageCategory: true,
                packagePriceAdult: true,
                packagePriceChild: true,
                packagePriceInfant: true,
                photos: true,
              },
            },
            payment: {
              select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
      },
    }),
    prisma.cancelRequest.count({
      where: whereClause,
    }),
  ]);

  return {
    cancelRequests,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const AdminService = {
  getDashboardStats,
  getUsersByCountry,
  getTourBookingsPerMonth,
  getAllBookedTourPackages,
  getTourPackageAnalytics,
  getCancelRequestStats,
  getAllCancelRequestsWithDetails,
};
