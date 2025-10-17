export class IBaseModel {
  id: number = 0;
  comments: string = '';
  created_at: string = '';
  deleted_at: string = '';

  /**Properties Front*/
  disabled: boolean = false;
}

export class BaseModel implements IBaseModel {
  id: number = 0;
  comments: string = '';
  created_at: string = '';
  deleted_at: string = '';
  disabled: boolean = false;
}
