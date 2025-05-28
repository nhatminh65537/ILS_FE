import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { hasPermission, getModuleProgressById } from "../../store/myUserSlice";
import { PERMISSIONS } from "../../constants/permissions";
import { PROGRESS_STATES } from "../../apis/learnProgressStates";
import ModuleProgressBar from "./ModuleProgressBar";

const ModuleCard = ({ module }) => {
    // Use a default image if module.imagePath is not available
    const imageUrl = module.imagePath || "https://picsum.photos/300/200";

    const canUpdate = useSelector((state) =>
        hasPermission(state, PERMISSIONS.Modules.Update)
    );
    
    // Get module progress from Redux store
    const moduleProgress = useSelector((state) => 
        getModuleProgressById(state, module.id)
    );

    // Determine button text and color based on progress state
    let buttonText = "Start Learning";
    let buttonColorClass = "btn-primary";
    
    if (moduleProgress && moduleProgress.progressState) {
        const stateName = moduleProgress.progressState.name;
        if (stateName === PROGRESS_STATES.COMPLETED) {
            buttonText = "Review";
            buttonColorClass = "btn-success";
        } else if (stateName === PROGRESS_STATES.LEARNING) {
            buttonText = "Continue";
            buttonColorClass = "btn-info";
        }
    }

    return (
        <div className="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <figure className="h-48 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={module.title}
                    className="w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{module.title}</h2>
                <p className="line-clamp-2">{module.description}</p>

                <div className="flex flex-wrap gap-2 my-2">
                    {module.category?.name && (
                        <div className="badge badge-outline">
                            {module.category.name}
                        </div>
                    )}
                    {module.lifecycleState?.name && (
                        <div className="badge badge-primary badge-outline">
                            {module.lifecycleState.name}
                        </div>
                    )}
                    {module.tags?.map((tag, index) => (
                        <div
                            key={index}
                            className="badge badge-secondary badge-outline"
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
                
                {/* Display progress information if moduleProgress exists */}
                {moduleProgress && (
                    <div className="mt-2 mb-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">Progress</span>
                            {moduleProgress.progressState?.name && (
                                <span className="text-xs">
                                    {moduleProgress.progressState.name === PROGRESS_STATES.COMPLETED ? (
                                        <span className="badge badge-sm badge-success">Completed</span>
                                    ) : moduleProgress.progressState.name === PROGRESS_STATES.LEARNING ? (
                                        <span className="badge badge-sm badge-info">In Progress</span>
                                    ) : (
                                        <span className="badge badge-sm">Not Started</span>
                                    )}
                                </span>
                            )}
                        </div>
                        <ModuleProgressBar progress={moduleProgress.progressPercentage} />
                    </div>
                )}

                <div className="flex items-center justify-between mt-2 text-sm text-base-content/70">
                    <div>XP: {module.xp || 0}</div>
                    <div>Duration: {module.duration || 0} min</div>
                </div>

                <div className="card-actions justify-end mt-4">
                    {canUpdate && (
                        <Link
                            to={`/learn/edit/${module.id}`}
                            className="btn btn-secondary btn-sm"
                        >
                            Edit
                        </Link>
                    )}
                    <Link
                        to={`/learn/${module.id}`}
                        className={`btn ${buttonColorClass} btn-sm`}
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ModuleCard;
