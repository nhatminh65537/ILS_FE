import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-200"
        style={{
          backgroundImage: 'url(image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="hero-content text-center text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Infosec Learning System</h1>
            <p className="py-6 font-semibold">
              Master cybersecurity through interactive learning modules,
              real-world challenges, and competitive assessments.
            </p>
            {isAuthenticated ? (
              <Link to="/learn" className="btn btn-primary text-white">
                Start Learning
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary">
                  Register Now
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="card-title">Structured Learning</h3>
                <p>
                  Progress through carefully crafted modules designed to build
                  your cybersecurity knowledge from fundamentals to advanced topics.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="card-title">Practical Challenges</h3>
                <p>
                  Apply your knowledge in realistic scenarios and CTF-style
                  challenges that simulate actual security situations.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title">Track Your Progress</h3>
                <p>
                  Monitor your improvement with detailed analytics and compare
                  your performance with others on the scoreboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Join Our Growing Community
          </h2>
          
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Users</div>
              <div className="stat-value">1,200+</div>
              <div className="stat-desc">Active learners</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Lessons</div>
              <div className="stat-value text-primary">50+</div>
              <div className="stat-desc">Across multiple domains</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Challenges</div>
              <div className="stat-value">100+</div>
              <div className="stat-desc">From basic to advanced</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Cybersecurity Journey?
          </h2>
          <p className="mb-8 max-w-lg mx-auto">
            Join thousands of security professionals and enthusiasts building
            their skills on our platform.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Your Free Account
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/learn" className="btn btn-secondary btn-lg">
              Continue Learning
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
