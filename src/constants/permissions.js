/**
 * PERMISSIONS constant for the Infosec Learning System
 * This constant contains all available permissions in the system
 * Access is restricted through this single exported PERMISSIONS constant
 */

export const PERMISSIONS = {
    Auth: {
        Login: "Auth.Login",
        Register: "Auth.Register",
        Logout: "Auth.Logout",
        ChangePassword: "Auth.ChangePassword",
    },

    Categories: {
        GetAll: "LearnCategories.GetAll",
        Get: "LearnCategories.Get",
        Create: "LearnCategories.Create",
        Update: "LearnCategories.Update",
        Delete: "LearnCategories.Delete",
    },
    
    ChallengeCategory: {
        GetAll: "ChallengeCategory.GetAll",
        Get: "ChallengeCategory.Get",
        Create: "ChallengeCategory.Create",
        Update: "ChallengeCategory.Update",
        Delete: "ChallengeCategory.Delete",
    },
    
    ChallengeNode: {
        GetPaginated: "ChallengeNode.GetPaginated",
        Create: "ChallengeNode.Create",
        Get: "ChallengeNode.Get",
        Update: "ChallengeNode.Update",
        Delete: "ChallengeNode.Delete",
    },
    
    ChallengeProblem: {
        GetAll: "ChallengeProblem.GetAll",
        Get: "ChallengeProblem.Get",
        Create: "ChallengeProblem.Create",
        Update: "ChallengeProblem.Update",
        Delete: "ChallengeProblem.Delete",
        UploadFile: "ChallengeProblem.UploadFile",
        UpdateFile: "ChallengeProblem.UpdateFile",
    },
    
    ChallengeState: {
        GetAll: "ChallengeState.GetAll",
        Get: "ChallengeState.Get",
        Update: "ChallengeState.Update",
    },
    
    ChallengeTag: {
        GetAll: "ChallengeTag.GetAll",
        Get: "ChallengeTag.Get",
        Create: "ChallengeTag.Create",
        Update: "ChallengeTag.Update",
        Delete: "ChallengeTag.Delete",
    },
    
    CheckFlag: {
        CheckFlag: "CheckFlag.CheckFlag",
    },

    Lessons: {
        GetAll: "LearnLessons.GetAll",
        Get: "LearnLessons.Get",
        Create: "LearnLessons.Create",
        Update: "LearnLessons.Update",
        Delete: "LearnLessons.Delete",
    },

    LessonTypes: {
        GetAll: "LearnLessonTypes.GetAll",
        Get: "LearnLessonTypes.Get",
        Update: "LearnLessonTypes.Update",
    },

    LifecycleStates: {
        GetAll: "LearnLifecycleStates.GetAll",
        Get: "LearnLifecycleStates.Get",
        Put: "LearnLifecycleStates.Put",
    },

    Modules: {
        GetAll: "LearnModules.GetAll",
        Get: "LearnModules.Get",
        Create: "LearnModules.Create",
        Update: "LearnModules.Update",
        Delete: "LearnModules.Delete",
    },

    LearnNodes: {
        GetAll: "LearnNodes.GetAll",
        Get: "LearnNodes.Get",
        Create: "LearnNodes.Create",
        Update: "LearnNodes.Update",
        Delete: "LearnNodes.Delete",
        GetTree: "LearnNodes.GetTree",
        UpdateTree: "LearnNodes.UpdateTree",
    },

    MyUser: {
        Get: "MyUser.Get",
        Update: "MyUser.Update",
        GetPermissions: "MyUser.GetPermissions",
        GetRoles: "MyUser.GetRoles",
        GetProfile: "MyUser.GetProfile",
        GetModuleProgress: "MyUser.GetModuleProgress",
        UpdateLearnModuleProgress: "MyUser.UpdateLearnModuleProgress",
        UpdateLearnLessonFinish: "MyUser.UpdateLearnLessonFinish",
        GetLessonFinish: "MyUser.GetLessonFinish",
    },

    Permissions: {
        GetAll: "Permissions.GetAll",
        Get: "Permissions.Get",
        Put: "Permissions.Put",
    },

    ProgressStates: {
        GetAll: "LearnProgressStates.GetAll",
        Get: "LearnProgressStates.Get",
        Update: "LearnProgressStates.Update",
    },

    Roles: {
        GetAll: "Roles.GetAll",
        Get: "Roles.Get",
        Create: "Roles.Create",
        Update: "Roles.Update",
        Delete: "Roles.Delete",
        GetPermissions: "Roles.GetPermissions",
        AddPermission: "Roles.AddPermission",
        RemovePermission: "Roles.RemovePermission",
    },

    Tags: {
        GetAll: "LearnTags.GetAll",
        Get: "LearnTags.Get",
        Create: "LearnTags.Create",
        Update: "LearnTags.Update",
        Delete: "LearnTags.Delete",
    },

    Users: {
        GetAll: "Users.GetAll",
        GetByUsername: "Users.GetByUsername",
        GetByEmail: "Users.GetByEmail",
        Get: "Users.Get",
        Create: "Users.Create",
        Update: "Users.Update",
        Delete: "Users.Delete",
        GetProfile: "Users.GetProfile",
        GetPermissions: "Users.GetPermissions",
        AddPermission: "Users.AddPermission",
        RemovePermission: "Users.RemovePermission",
        GetRoles: "Users.GetRoles",
        AddRole: "Users.AddRole",
        RemoveRole: "Users.RemoveRole",
        GetUserScoreboard: "Users.GetUserScoreboard",
    },
};
