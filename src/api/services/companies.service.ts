import { Company, CreateCompanyData, UpdateCompanyData, CompanyFilters } from '../types';
import { mockCompanies } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const companiesService = {
  async getAll(filters?: CompanyFilters): Promise<Company[]> {
    await delay();
    let results = [...mockCompanies];

    if (filters?.industry) {
      results = results.filter(c => c.industry === filters.industry);
    }
    if (filters?.size) {
      results = results.filter(c => c.size === filters.size);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }

    return results;
  },

  async getById(id: string): Promise<Company | null> {
    await delay();
    return mockCompanies.find(c => c.id === id) || null;
  },

  async create(data: CreateCompanyData): Promise<Company> {
    await delay();
    const newCompany: Company = {
      id: Date.now().toString(),
      ...data,
      tags: data.tags || [],
      followers: 0,
      questionsCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newCompany;
  },

  async update(id: string, data: UpdateCompanyData): Promise<Company> {
    await delay();
    const company = mockCompanies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');
    return { ...company, ...data };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async searchCompanies(query: string): Promise<Company[]> {
    await delay();
    const search = query.toLowerCase();
    return mockCompanies.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
  },

  async followCompany(userId: string, companyId: string): Promise<void> {
    await delay();
  },

  async unfollowCompany(userId: string, companyId: string): Promise<void> {
    await delay();
  },
};
