export interface IGeneratePresignedUrlRequest {
  fileName: string;
  fileType: string;
  purpose: 'profile-photo' | 'cover-photo' | 'tour-package';
  fileSize?: number;
}

export interface IGeneratePresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export interface IDeletePhotoRequest {
  photoUrl: string;
}

export interface IDeleteMultiplePhotosRequest {
  photoUrls: string[];
}

