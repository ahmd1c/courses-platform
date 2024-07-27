export const resetPasswordHtml = (url: string) => {
  return `
  <h1>Reset Password</h1>
  <p>Please click the link below to reset your password</p>
  <a href="${url}">Reset Password</a>
  <p>This link will expire in 10 minutes</p>
  `;
};
