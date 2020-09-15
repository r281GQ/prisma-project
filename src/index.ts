type User = {
  id: number;
  firstName: string;
  lastName: string;
};

type Select<T> = {
  [key in keyof T]?: boolean;
};

const user: User = {
  id: 1,
  firstName: "Endre",
  lastName: "Vegh",
};

type Args<T> = {
  where: { id: number };
  select?: Select<T>;
};

type GetTruthy<T> = {
  [key in keyof T]: T[key] extends true ? key : never;
}[keyof T];

type MapSelectToSchema<SelectedFields, Schema> = {
  [key in GetTruthy<SelectedFields>]: key extends keyof Schema
    ? Schema[key]
    : never;
};

type FindOneResult<Args, Schema> = "select" extends keyof Args
  ? MapSelectToSchema<Args["select"], Schema>
  : Schema;

function createSchema<Schema>(entity: Schema) {
  return {
    findOne<T extends Args<Schema>>(args: T): FindOneResult<T, Schema> {
      return (entity as unknown) as FindOneResult<T, Schema>;
    },
  };
}

// usage
const client = createSchema(user);

// call findOne
const returnedUser = client.findOne({
  where: { id: 1 },
  select: { firstName: false },
});
