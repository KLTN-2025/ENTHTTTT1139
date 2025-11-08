export interface LoginResponse {
  data: {
    user: {
      userId: string;
      email: string;
      fullName: string;
      avatar: string | null;
      role: string;
      title: string | null;
      description: string | null;
      createdAt: string;
      updatedAt: string;
      websiteLink: string | null;
      facebookLink: string | null;
      youtubeLink: string | null;
      linkedinLink: string | null;
      isEmailVerified: boolean;
      verificationEmailToken: string | null;
      verificationEmailTokenExp: string | null;
      resetPasswordToken: string | null;
      resetPasswordTokenExp: string | null;
    };
    accessToken: string;
  };
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}
