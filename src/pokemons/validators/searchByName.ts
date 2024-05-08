import { IsString, Length } from 'class-validator';

export class SearchByNameParams {
  @IsString()
  @Length(3)
  name: string;
}
