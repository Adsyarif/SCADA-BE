export interface CreateReportReplyRequest {
  reportId: string;
  userId: string;
  message: string;
  parentReplyId?: string;
}

export interface CreateReportReplyResponse {
  replyId: string;
  createdAt: Date;
}

export interface GetRepliesByReportIdRequest {
  reportId: string;
}

export interface ReplyDetail {
  replyId: string;
  userId: string;
  message: string;
  parentReplyId?: string;
  createdAt: Date;
}

export interface GetRepliesByReportIdResponse {
  replies: ReplyDetail[];
}
