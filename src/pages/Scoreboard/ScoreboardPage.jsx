import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScoreboard } from '../../store/scoreboardSlice';

const ScoreboardPage = () => {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    currentPage, 
    pageSize, 
    totalPages 
  } = useSelector(state => state.scoreboard);
  
  const myUserId = useSelector(state => state.myUser?.userData?.id);

  useEffect(() => {
    dispatch(fetchScoreboard({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchScoreboard({ page, pageSize }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-16 text-center">Rank</th>
              <th>User</th>
              <th className="text-right">Score</th>
              <th className="text-right">Level</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={user.id === myUserId ? "bg-base-200" : ""}>
                <td className="text-center font-bold">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img 
                          src={user.avatarPath || "/default-avatar.png"} 
                          alt={`${user.userName}'s avatar`} 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.displayName || user.userName}</div>
                      {user.displayName && <div className="text-sm opacity-50">{user.userName}</div>}
                    </div>
                  </div>
                </td>
                <td className="text-right font-semibold">{user.xp || 0} XP</td>
                <td className="text-right">{user.level || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="join mt-4 flex justify-center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreboardPage;
