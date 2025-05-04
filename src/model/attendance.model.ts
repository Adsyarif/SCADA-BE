export class CreateAttendanceRequest {
  staffId: string;
}

export class CreateAttendanceResponse {
  staffName: string;
  createAt: Date;
}

export class CreateRequestAttendanceRequest {
  staffId: string;
  createAt: Date;
}

export class CreateRequestAttendanceResponse {
  staffName: string;
}

export class GetAttendanceByIdRequest {
  staffId: string;
}

export class GetAttendanceByIdResponse {
  staffName: string;
  createAt: string;
}

export class GetAttendanceByFilterRequest {
  supervisorId: string;
  staffName?: string;
  createAt?: Date;
}

export class GetAttendanceByFilterResponse {
  staffId: string;
  staffName: string;
  createDate: string;
}
