// services/authService.ts
const users = [
    { email: "user@example.com", password: "password123" },
    { email: "admin@example.com", password: "admin123" },
];

export const fakeLogin = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = users.find(u => u.email === email && u.password === password);
    return user ? { email: user.email } : null;
};