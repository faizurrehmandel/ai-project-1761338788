# AI Project Manager V10

A professional dashboard application that generates and manages software projects using AI. This system integrates with GitHub and OpenRouter AI to create complete, production-ready codebases based on natural language descriptions.

## Features

- Create AI-generated software projects with complete codebases
- Automatic GitHub repository creation and code deployment
- Edit existing projects with AI assistance
- Professional dark-themed dashboard interface
- Real-time project status tracking
- Secure API integration with GitHub and OpenRouter

## Technology Stack

- **Backend:** Flask with SQLite database
- **Frontend:** Modern HTML5, CSS3, Vanilla JavaScript
- **APIs:** GitHub API, OpenRouter AI API
- **Security:** Environment variables, input validation, error handling

## Installation

1. Clone the repository:
bash
git clone https://github.com/yourusername/ai-project-manager.git
cd ai-project-manager


2. Create and activate a virtual environment:
bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate


3. Install dependencies:
bash
pip install -r requirements.txt


4. Create a `.env` file in the project root with your API keys:

GITHUB_TOKEN=your_github_personal_access_token
OPENROUTER_API_KEY=your_openrouter_api_key


## Configuration

1. GitHub Token: Create a personal access token with `repo` scope at https://github.com/settings/tokens
2. OpenRouter API Key: Get your API key from https://openrouter.ai/

## Running the Application

1. Start the development server:
bash
python main.py


2. Access the dashboard at http://localhost:5000

## Production Deployment

1. Set up your production environment variables
2. Use gunicorn for production deployment:
bash
gunicorn main:app


## Security Considerations

- All API keys are stored as environment variables
- Input validation and sanitization implemented
- CSRF protection enabled
- Secure error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- OpenRouter AI for providing the AI capabilities
- GitHub for the repository management API
- The Flask team for the excellent web framework