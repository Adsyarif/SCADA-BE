import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Logger } from 'winston';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateReportCategoryRequest,
  CreateReportCategoryResponse,
} from 'src/model/reportCategory.model';
import { CategoryReportValidation } from './report-category.validation';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class ReportCategoryService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async createCategoryReport(
    request: CreateReportCategoryRequest,
  ): Promise<CreateReportCategoryResponse> {
    try {
      this.logger.info(`Register new category: ${JSON.stringify(request)}`);
      const createCategoryReportRequest: CreateReportCategoryRequest =
        this.validationService.validate(
          CategoryReportValidation.CREATE,
          request,
        );
      const createCategory = await this.prismaService.reportCategory.create({
        data: {
          category_name: createCategoryReportRequest.categoryName,
        },
        include: {
          reports: true,
        },
      });

      return {
        categoryName: createCategory.category_name,
        createdDate: createCategory.created_at,
      };
    } catch (error) {
      this.logger.error('Error creating category', error);
      throw new Error('Failed to create category');
    }
  }
}
