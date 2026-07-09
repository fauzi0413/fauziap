import { adminRepository } from "@/repositories/admin";

export class AdminService {
  getDashboardStats() {
    return adminRepository.getDashboardStats();
  }

  getRecentActivity() {
    return adminRepository.getRecentActivity();
  }
}

export const adminService = new AdminService();
