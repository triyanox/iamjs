import { NextApiRequest } from "next";
import { authWrapper, nextServer, roleManager } from "../utils";

describe("NextRoleManager", () => {
  it("should return 403 when role is not authorized", async () => {
    const handler = roleManager.authorize<NextApiRequest & { role: string }>(
      {
        resource: "resource2",
        action: ["create", "update"],
      },
      (_req, res) => {
        res.status(200).send("Hello World!");
      }
    );

    const res = await nextServer(
      authWrapper<NextApiRequest & { role: string }>(handler) as any
    ).get("/resource2");
    expect(res.status).toBe(403);
    expect(res.text).toBe("Forbidden");
  });

  it("should return 200 when role is authorized", async () => {
    const handler = roleManager.authorize(
      {
        resource: "resource1",
        action: ["create", "update"],
      },
      (_req, res) => {
        res.status(200).send("Hello World!");
      }
    );

    const res = await nextServer(authWrapper(handler))
      .get("/resource1")
      .query({ role: "role1" });
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello World!");
  });

  it("should return 200 when role is authorized", async () => {
    const handler = roleManager.authorize(
      {
        resource: "resource1",
        action: ["create", "update"],
        permissionsKey: "permissions",
        usePermissionKey: true,
        roleKey: "role",
      },
      (_req, res) => {
        res.status(200).send("Hello World!");
      }
    );

    const res = await nextServer(authWrapper(handler))
      .get("/resource1")
      .query({ role: "role1" });
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello World!");
  });
});
