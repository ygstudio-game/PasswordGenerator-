# Enhanced Password Generator - React Component

![Password Generator Screenshot](screenshot.png)

## Overview

A sophisticated password generator React component that creates both random and memorable passwords with extensive customization options. Features a clean, responsive UI and robust security measures to help users generate strong, secure passwords.

## Features

- **Dual Password Generation Modes**:
  - Random passwords with customizable character sets
  - Memorable word-based passwords
- **Custom Elements**:
  - Add custom words, numbers, and symbols
  - Multiple custom elements with add/remove functionality
- **Password Strength Analysis**:
  - Visual strength indicator with color coding
  - Detailed strength percentage calculation
- **Enhanced Security**:
  - Uses `window.crypto` for secure random generation
  - Comprehensive strength calculation algorithm
- **User Experience**:
  - Copy to clipboard functionality
  - Show/hide password toggle
  - Responsive design for all devices
  - Clear error messaging

## Installation

1. Install required dependencies:
```bash
npm install react-icons
```

2. Import the component in your React application:
```jsx
import PasswordGenerator from './components/PasswordGenerator';
```

3. Use the component in your JSX:
```jsx
function App() {
  return (
    <div className="App">
      <PasswordGenerator />
    </div>
  );
}
```

## Usage

### Random Password Mode
1. Select "Random Password"
2. Adjust password length (4-64 characters)
3. Toggle character types (uppercase, lowercase, numbers, symbols)
4. Optionally add custom words, numbers, or symbols
5. Click "Generate New Password"

### Memorable Password Mode
1. Select "Memorable Password"
2. Configure options:
   - Number of words (3-7)
   - Word separator
   - Capitalization
   - Number addition
3. Optionally add prefix/suffix elements
4. Click "Generate New Password"

## Customization Options

| Feature | Description |
|---------|-------------|
| **Password Length** | 4 to 64 characters |
| **Character Types** | Uppercase, lowercase, numbers, symbols |
| **Custom Words** | Add your own words to passwords |
| **Custom Numbers** | Add specific numbers |
| **Custom Symbols** | Add special characters/emojis |
| **Word Count** | 3-7 words for memorable passwords |
| **Separators** | Hyphen, underscore, dot, comma, space, none |
| **Word Options** | Capitalize words, add numbers to words |

## Security Analysis

The component calculates password strength based on:
- Password length (25% of score)
- Character variety (75% of score)
- Penalty for short passwords (<8 characters)
- Bonus for memorable passwords and custom elements

**Strength categories**:
- 🔴 **Weak** (<40%)
- 🟠 **Medium** (40-69%)
- 🟢 **Strong** (70-89%)
- 💪 **Very Strong** (≥90%)

## Security Tips

1. Use at least 12 characters
2. Include a mix of character types
3. Make memorable passwords with unrelated words
4. Use unique passwords for each account
5. Consider using a password manager

## Dependencies

- React (v17+)
- [react-icons](https://react-icons.github.io/react-icons/)

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Note**: Add a screenshot of your component in the same directory as this README named `screenshot.png` to display the interface preview.