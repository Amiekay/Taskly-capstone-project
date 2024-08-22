import express from "express";
const middleware = require("../middleware/auth");
const router = express.Router();
const Orgcontroller = require("../controllers/organizationController");
const boardController = require("../controllers/boardController");
const taskController = require("../controllers/taskControllers");
const report = require("../utils/analytics");
const uploadMiddleware = require("../middleware/upload");
const attachment = require("../controllers/taskControllers");

const upload = uploadMiddleware("folderName");

router.post("/", Orgcontroller.createOrganization);
router.put(
  "/board/:boardId",
  middleware.bearerTokenAuth,
  boardController.addMembersToBoard
);
router.post("/board", middleware.bearerTokenAuth, boardController.createBoard);
router.post(
  "/board/task/:boardId",
  middleware.bearerTokenAuth,
  taskController.createTask
);
router.put(
  "/board/task/assignTask/:taskId",
  middleware.bearerTokenAuth,
  taskController.assignTaskToUser
);
router.put(
  "/board/task/progress/:taskId",
  middleware.bearerTokenAuth,
  taskController.updateTaskStatus
);
router.get("/board/tasks", middleware.bearerTokenAuth, taskController.getTasks);
router.post(
  "/board/task/comment/:taskId",
  middleware.bearerTokenAuth,
  taskController.addComment
);
router.get(
  "/reports/:organizationId",
  middleware.bearerTokenAuth,
  report.generateWeeklyReport
);

router.post(
  "/tasks/:taskId/attachments",
  upload.single("file"),
  taskController.uploadTaskAttachment
);

module.exports = router;
