/**
 * @file Declares follow data type representing relationship between
 * users and uses, as in user follow user
 */
import User from "../users/User";

/**
 * @typedef Follow Represents likes relationship between a user and a tuit,
 * as in a user likes a tuit.
 * @property {user} User user follow.
 * @property {User} followedBy User follow other user.
 */

export default interface Follow {
    user:User,
    followedBy: User
};