import express, { Request } from "express";
import request from "supertest";
import { Role } from "@iamjs/core/lib";
import { ExpressRoleManager } from "@iamjs/express";

const role = new Role([
  {
    resource: "resource1",
    scopes: "crudl",
  },
  {
    resource: "resource2",
    scopes: "cr-dl",
  },
]);

const roleManager = new ExpressRoleManager({
  roles: {
    role1: role,
  },
  resources: ["resource1", "resource2"],
  onError(_err, _req, res, _next) {
    res.status(403).send("Forbidden");
  },
  onSucess(_req, res, _next) {
    res.status(200).send("Hello World from the success handler!");
  },
});

const app = express();

type IAuthRequest = Request & {
  role: string;
  permissions: any;
};

app.get(
  "/resource1",
  (req, _res, next) => {
    req.role = "role1";
    next();
  },
  roleManager.authorize<IAuthRequest>({
    resource: "resource1",
    action: ["create", "update"],
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.get(
  "/resource2",
  (req, _res, next) => {
    (req as unknown as IAuthRequest).role = "role1";
    next();
  },
  roleManager.authorize({
    resource: "resource2",
    action: ["create", "update"],
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.get(
  "/loose",
  (req, _res, next) => {
    (req as unknown as IAuthRequest).role = "role1";
    next();
  },
  roleManager.authorize({
    resource: "resource2",
    action: ["create", "update"],
    loose: true,
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.get(
  "/multiple",
  (req, _res, next) => {
    (req as unknown as IAuthRequest).role = "role1";
    next();
  },
  roleManager.authorize({
    resource: ["resource1", "resource2"],
    action: ["create", "update"],
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

app.get(
  "/from-permissions",
  (req, _res, next) => {
    (req as unknown as IAuthRequest).role = "role1";
    (req as unknown as IAuthRequest).permissions = role.toObject();
    next();
  },
  roleManager.authorize({
    resource: "resource1",
    action: ["create", "update"],
    usePermissionKey: true,
  }),
  (_req, res) => {
    res.send("Hello World!");
  }
);

const server = request(app);

export default server;
