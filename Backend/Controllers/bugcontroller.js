import BugManager from "../Managers/bugmanager.js";
import BugConstants from "../constants/bugsconstants.js";

class BugController {
  static async getBugsByProject(req, res) {
    try {
      console.log("Controller");
      const user = req.user;
      console.log(user);
      const rawProjectId = req.params.id;
      const projectId = parseInt(rawProjectId, 10);
      const { search, page = 1, limit = 10 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const result = await BugManager.getBugsByProject(
        user,
        projectId,
        search,
        pageNum,
        limitNum
      );

      const isEmpty = !result || result.data.length === 0;

      res.status(200).json({
        success: true,
        message: isEmpty
          ? search
            ? BugConstants.MESSAGES.NO_MATCHING_BUGS
            : BugConstants.MESSAGES.NO_BUGS_FOUND
          : search
          ? BugConstants.MESSAGES.SEARCH_RESULTS
          : BugConstants.MESSAGES.BUGS_RETRIEVED,
        data: isEmpty ? [] : result.data,
        pagination: isEmpty
          ? {
              total: 0,
              page: pageNum,
              limit: limitNum,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            }
          : result.pagination,
      });
    } catch (err) {
      console.log("getBugsByProject:: Error:", err);
      res.status(400).json({
        success: false,
        message: BugConstants.MESSAGES.INTERNAL_ERROR,
      });
    }
  }

  static async createBug(req, res) {
    try {
      const user = req.user;
      const { projectId, bugData } = req.body;
      const Bug = await BugManager.createBug(user.id, projectId, bugData);

      res.status(201).json({
        success: true,
        message: BugConstants.MESSAGES.BUG_CREATED,
        data: Bug,
      });
    } catch (err) {
      console.log("createBug:: Error:", err);
      res.status(400).json({
        success: false,
        message: BugConstants.MESSAGES.INTERNAL_ERROR,
      });
    }
  }

  static async updateBugStatus(req, res) {
    try {
      const user = req.user;
      const { projectId, bugId, status } = req.body;
      console.log(projectId);

      const result = await BugManager.updateBugStatus(
        user,
        projectId,
        bugId,
        status
      );

      res.status(200).json({
        success: true,
        message: BugConstants.MESSAGES.BUG_STATUS_UPDATED,
        data: result,
      });
    } catch (err) {
      console.log("updateBugStatus:: Error:", err);
      res.status(400).json({
        success: false,
        message: BugConstants.MESSAGES.INTERNAL_ERROR,
      });
    }
  }

  static async deleteBug(req, res) {
    try {
      const user = req.user;
      const { projectId, bugId } = req.body;
      const result = await BugManager.deleteBug(user, projectId, bugId);

      res.status(200).json({
        success: true,
        message: BugConstants.MESSAGES.BUG_DELETED,
        data: result,
      });
    } catch (err) {
      console.log("deleteBug:: Error:", err);
      res.status(400).json({
        success: false,
        message: BugConstants.MESSAGES.INTERNAL_ERROR,
      });
    }
  }
}

export default BugController;

