/**
 * @file Controller RESTful Web service API for follows resource
 */
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";

/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/users/:uid1/follows/:uid2 to record that a user follows another user
 *     </li>
 *     <li>DELETE /api/users/:uid1/follows/:uid2 to record that a user no longer follows another user
 *     </li>
 *     <li>GET /api/users/:uid/following to retrieve all users followed by a user
 *     </li>
 *     <li>GET /api/users/:uid/followers to retrieve all users following a user
 *     </li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing likes CRUD operations
 * @property {FollowController} FollowController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */

    public static getInstance = (app: Express): FollowController => {
        if(FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.put("/api/users/:uid1/follows/:uid2", FollowController.followController.userToggleUserFollows);
            app.get("/api/users/:uid/following", FollowController.followController.findAllUsersFollowedByUser);
            app.get("/api/users/:uid/followers", FollowController.followController.findAllUsersThatFollowUser);
        }
        return FollowController.followController;
    }

    private constructor() {}

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and uid representing the user that is following another user
     * and another user being followed.
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follows that was inserted in the
     * database
     */
    userFollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(follows => res.json(follows));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and uid representing the user that is unfollowing another user
     * and another user being unfollowed.
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follows that was inserted in the
     * database
     */
    userUnfollowsAnotherUser = (req: Request, res:Response) =>
        FollowController.followDao.userUnfollowsAnotherUser(req.params.uid1, req.params.uid2)
            .then(status => res.send(status));

    /**
     * Retrieves all users that a user following.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the followed user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersFollowedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        FollowController.followDao.findAllUsersFollowedByUser(userId)
            .then(follows => res.json(follows));
    }


    /**
     * Retrieves all users that followed a user from the database.
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the followed user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatFollowUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;

        FollowController.followDao.findAllUsersThatFollowUser(userId)
            .then(follows => res.json(follows));
    }



    userToggleUserFollows = async (req: Request, res: Response) => {
        const followDao = FollowController.followDao;
        const uid2 = req.params.uid2;
        const uid1 = req.params.uid1;

        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid1 === "me" && profile ?
            profile._id : uid1;

        try {
            const userAlreadyFollowsUser = await followDao.findUserFollowAnotherUser(userId, uid2);
            //TODO: delete this console log.
            console.log(userAlreadyFollowsUser);
            if (Object.keys(userAlreadyFollowsUser).length === 0) {
                //TODO: delete this console log.
                console.log("can not find.");
                await FollowController.followDao.userFollowsAnotherUser(userId, uid2);
            } else {
                //TODO: delete this console log.
                console.log("can find.");
                await followDao.userUnfollowsAnotherUser(userId, uid2);
            }
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }
};