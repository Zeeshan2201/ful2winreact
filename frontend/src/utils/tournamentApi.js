// Environment-aware API base URL
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  } else {
    return 'https://ful2winreact.onrender.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with authentication
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Tournament API functions
export const tournamentApi = {
  // Get all tournaments
  getAllTournaments: async (status = null, game = null) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (game) params.append('game', game);
      
      const response = await fetch(`${API_BASE_URL}/tournaments?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  },

  // Get single tournament
  getTournament: async (tournamentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}`);
      if (!response.ok) throw new Error('Failed to fetch tournament');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tournament:', error);
      throw error;
    }
  },

  // Register for tournament
  registerForTournament: async (tournamentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: createAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register for tournament');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering for tournament:', error);
      throw error;
    }
  },

  // Submit tournament score
  submitScore: async (tournamentId, score) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/score`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify({ score })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit score');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  },

  // Get tournament leaderboard
  getLeaderboard: async (tournamentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Get user's tournaments
  getUserTournaments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/user/my-tournaments`, {
        headers: createAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch user tournaments');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user tournaments:', error);
      throw error;
    }
  }
};

export default tournamentApi;
