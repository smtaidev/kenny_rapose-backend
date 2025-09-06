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

export const AdminService = {
  getDashboardStats,
  getUsersByCountry,
  getTourBookingsPerMonth,
  getAllBookedTourPackages,
};
