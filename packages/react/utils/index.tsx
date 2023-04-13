import { Role } from "@iamjs/core";
import { usePerm } from "@iamjs/react";
import React from "react";

const role = new Role([
  {
    resource: "books",
    scopes: "----l",
  },
]);

const PermissionProviderTestComponent = () => {
  const { setPerm, getPerm } = usePerm(role);

  const handleSetPerm = () => {
    setPerm("books", "create", true);
  };

  return (
    <>
      <div data-testid="books-create-permission">
        {getPerm("books", "create").toString()}
      </div>
      <button onClick={handleSetPerm} data-testid="set-perm-button">
        Set Permission
      </button>
    </>
  );
};

const FromJSONStringTestComponent = () => {
  const { setPerm, getPerm } = usePerm(role.toJSON());

  const handleSetPerm = () => {
    setPerm("books", "create", true);
  };

  return (
    <>
      <div data-testid="books-create-permission">
        {getPerm("books", "create").toString()}
      </div>
      <button onClick={handleSetPerm} data-testid="set-perm-button">
        Set Permission
      </button>
    </>
  );
};

const PermissionsStingTestComponent = () => {
  const { setPerm, getPerm } = usePerm(role);

  const handleSetPerm = () => {
    setPerm("books", "create", true);
  };

  return (
    <>
      <div data-testid="books-read-permission">
        {getPerm("books:list,create").toString()}
      </div>
      <button onClick={handleSetPerm} data-testid="set-perm-button">
        Set Permission
      </button>
    </>
  );
};

export {
  PermissionProviderTestComponent,
  PermissionsStingTestComponent,
  FromJSONStringTestComponent,
};
