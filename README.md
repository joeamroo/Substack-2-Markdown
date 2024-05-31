# Substack to Markdown Converter

This project is a web application that allows users to convert Substack articles to Markdown format. It also provides a feature to download all articles from a Substack user as a ZIP file.

## Prerequisites

- Node.js 
- Python 
- Dependencies listed in `requirements.txt` and `package.json` (Install Via venv)

## Installation

1. Clone the repository:
git clone https://github.com/your-username/substack-to-markdown-converter.git
Copy code
2. Navigate to the project directory:
cd substack-to-markdown-converter
Copy code
3. Install Python dependencies:
python -m venv venv
source venv/bin/activate  # On Windows, use venv\Scripts\activate
pip install -r requirements.txt
Copy code
4. Install Node.js dependencies:
npm install
Copy code
## Usage

1. Start the development server:
npm run dev
Copy code
2. Open your browser and visit `http://localhost:3000`.

3. To convert a single Substack article:
- Enter the Substack article URL in the input field.
- Click the "Convert" button.
- The converted Markdown content will be displayed, and you can download it as a file.

4. To download all articles from a Substack user:
- Enter the Substack username or profile URL in the input field.
- Click the "Convert All" button.
- A ZIP file containing all articles in Markdown format will be downloaded.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).

(Readme written by ChatGPT)