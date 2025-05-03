export class GetSupervisorRequest {
  staffId: string;
}

export class GetSupervisorResponse {
  supervisorId: string;
  superVisorName: string;
}

export class GetOperatorRequest {
  supervisorId: string;
}

export class GetOperatorResponse {
  operatorId: string;
  operatorName: string;
}
