export type GroupRole = "author" | "admin" | "mod" | null;



export interface User {
    _id: any;
    fullname: string;
    username: string;
    email: string;

    profileImage?: string;
    backgroundImage?: string;

    isFollowed?: boolean;
    followers: number;

    followingMe?: boolean;
    following: number;

    private: boolean;
    isRequested?: boolean;
    requestedMe?: boolean;

    groups?: any[];
    role?: string;
    admin?: boolean;
}

export interface Post {
    _id: string,
    text: string,
    files?: string[],

    survey?: Survey,

    time: number;

    likes: number;
    comments: number;
    saves?: number;

    isLiked?: boolean;
    isSaved?: boolean;
    
    userId?: string,
    user: User;

    groupId?: string;
    group?: Group;
    myRole?: GroupRole;
}

export interface SurveyChoice {
    text: string,
    votes: number
}

export interface Survey {
    open: boolean;
    choices: SurveyChoice[];
    myVote?: number;
    votesCount: number;
}

export interface Comment {
    _id: string;
    text: string;

    postId: string;
    userId: string;

    user: User;
    time: number;
    myRole?: GroupRole;
}

export interface Rule {
    header: string;
    description?: string;
}

export type Privilage = "admin" | "mod" | "all";

export interface MembersPrivilages {
    posting: Privilage;
    approving: Privilage;
}

export interface Group {
    _id: string;
    name: string;
    members: number;

    private: boolean;
    hidden?: boolean;

    backgroundImage?: string;
    description?: string;
    rules?: Rule[];
    links?: string[];

    myRole: GroupRole;

    privilages: MembersPrivilages;

    requested?: boolean;
    joined?: boolean;
}

export type FileType = "image" | "video" |"file";