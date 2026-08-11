
interface selectJoin {
  name: string;
  type: "left"  | "inner";
  condition?: string; //主表别名为a 关联表为j+index(j0,j1,j2...) a.user_id = j0.id
  alia?: string;
}

interface page<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}