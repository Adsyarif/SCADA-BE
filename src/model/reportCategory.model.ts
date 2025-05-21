export class GetReportCategoryResponse {
  categoryId: string;
  categoryName: string;
}

export class CreateReportCategoryRequest {
  categoryName: string;
}

export class CreateReportCategoryResponse {
  categoryName: string;
  createdDate: Date;
}

export class GetCompletedReportCategoryResponse {
  categoryId: string;
  categoryName: string;
  createDate: Date;
}
