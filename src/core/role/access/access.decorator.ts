import { SetMetadata } from '@nestjs/common';

export const RequireAccess = (access: string) => SetMetadata('access', access); 