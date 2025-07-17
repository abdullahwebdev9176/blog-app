import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faSpinner, 
  faCheck,
  faPaperPlane 
} from '@fortawesome/free-solid-svg-icons';

const NewsletterForm = ({ showHeading = true, variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/subscribe', { email });
      
      if (response.data.success) {
        setSubscribed(true);
        toast.success('🎉 Successfully subscribed to our newsletter!');
        setEmail('');
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setSubscribed(false);
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'newsletter-compact',
          form: 'd-flex gap-2',
          input: 'form-control form-control-sm',
          button: 'btn btn-primary btn-sm'
        };
      case 'inline':
        return {
          container: 'newsletter-inline',
          form: 'input-group',
          input: 'form-control',
          button: 'btn btn-primary'
        };
      default:
        return {
          container: 'newsletter-default',
          form: 'd-grid gap-3',
          input: 'form-control form-control-lg',
          button: 'btn btn-primary btn-lg'
        };
    }
  };

  const classes = getVariantClasses();

  return (
    <div className={`newsletter-subscription py-5 ${classes.container}`}>
      {showHeading && (
        <div className="newsletter-header text-center mb-4">
          <div className="newsletter-icon mb-3">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="text-primary"
              style={{ fontSize: '2.5rem' }}
            />
          </div>
          <h2 className="newsletter-title h3 fw-bold text-dark mb-2">
            Stay Updated!
          </h2>
          <p className="newsletter-subtitle text-muted mb-0">
            Subscribe to get the latest news, updates, and exclusive offers delivered straight to your inbox.
          </p>
        </div>
      )}

      <div className="newsletter-form-container">
        {subscribed ? (
          <div className="text-center py-4">
            <div className="success-animation mb-3">
              <FontAwesomeIcon 
                icon={faCheck} 
                className="text-success"
                style={{ fontSize: '3rem' }}
              />
            </div>
            <h4 className="text-success mb-2">Welcome to the family! 🎉</h4>
            <p className="text-muted">
              Thank you for subscribing. You'll receive our latest updates soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={variant === 'inline' ? '' : 'mb-3'}>
              <div className="position-relative">
                {variant !== 'inline' && (
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                    style={{ fontSize: '1rem', zIndex: 5 }}
                  />
                )}
                <input
                  type="email"
                  className={`${classes.input} ${variant !== 'inline' ? 'ps-5' : ''}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`${classes.button} d-flex align-items-center justify-content-center gap-2`}
              disabled={loading || !email.trim()}
              style={variant === 'inline' ? {} : { minHeight: '48px' }}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="newsletter-footer text-center mt-3">
          <small className="text-muted">
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            No spam, unsubscribe at any time
          </small>
        </div>
      </div>

      <style jsx>{`
        .newsletter-subscription {
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-compact {
          max-width: 350px;
        }

        .newsletter-inline {
          max-width: 600px;
        }

        .newsletter-icon {
          animation: bounce 2s infinite;
        }

        .success-animation {
          animation: zoomIn 0.5s ease-out;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 576px) {
          .newsletter-default .d-grid {
            gap: 1rem !important;
          }
          
          .newsletter-inline .input-group {
            flex-direction: column;
          }
          
          .newsletter-inline .btn {
            border-top-left-radius: 0.375rem !important;
            border-top-right-radius: 0.375rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsletterForm;
