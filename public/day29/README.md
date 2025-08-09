# [Easy-Qr-Maker](https://bit.ly/iaman-qrcode)

This project is a simple QR Code Generator built with HTML, CSS, and JavaScript. The application allows users to input text and generate a QR code of varying sizes. The generated QR code can be viewed directly in the browser.
## Features
- Dynamic QR Code Generation: Users can enter any text, and a QR code is dynamically generated.
- Customizable Sizes: QR codes can be generated in four different sizes (Small, Normal, Average, Maximum).
- User-Friendly Interface: Clean and straightforward design for easy use.
## How It Works
1.	Enter the text you want to encode into the QR code in the text area provided.
2.	Select the size of the QR code from the dropdown menu.
3.	Click the "Generate" button to create the QR code.
4.	The generated QR code will appear below the button.
## Files
**index.html**
The main HTML file containing the structure of the application.
It includes:
- A text input area for the user to input data.
- A dropdown menu for selecting the size of the QR code.
- A button to generate the QR code.
- An image element to display the generated QR code.
**style.css**
The CSS file for styling the application. You can customize the appearance of the application by modifying this file.
**script.js**
The QR code generation functionality is handled by a simple inline JavaScript function go(), which:
- Retrieves the user input and selected size.
- Constructs a URL for the QR code API: https://api.qrserver.com/v1/create-qr-code/.
- Updates the src attribute of the img element to display the generated QR code.
## Prerequisites
To run this project, you need:
- A modern web browser (e.g., Chrome, Firefox, Edge, or Safari).
- No additional setup or software installation is required.
## Usage
1.	Open index.html in your browser.
2.	Enter the text you want to encode in the input box.
3.	Select the desired size for the QR code.
4.	Click the "Generate" button to create the QR code.
## API Reference
This project uses the QR Code Generator API provided by goqr.me.
- Endpoint: https://api.qrserver.com/v1/create-qr-code/
- Parameters:
1. size: Size of the QR code (e.g., 100x100).
2. data: The text or URL to encode.
Example API call:
https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HelloWorld
## Future Improvements
- Add functionality to download the generated QR code as an image.
- Improve input validation and error handling.
- Enhance the UI with additional design elements.
## License
This project is open-source and available under the MIT License.
Feel free to customize and extend this project as needed!
## Contact
For any inquiries or to connect:
Email: amanajaz990@gmail.com
GitHub: Iamanajaz
