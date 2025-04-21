# Gamepad-API-Testtool

An Electron application built with Vue, Vite, and TypeScript to test the FFI connection to [Gamepad_API](https://github.com/Aileck/Gamepad_API).

## Overview

This test tool provides a simple frontend interface to create and test virtual gamepad controllers:
- Xbox 360 controller emulation
- DualShock 4 controller emulation
- Virtual input interface for testing button presses and analog inputs

![image](https://github.com/user-attachments/assets/8cefbb05-ac31-4965-8396-bc9fef3ae299)


## ⚠️ Warning ⚠️

**This is an unfinished test application in early development.**

- Follow the happy path for simple testing only
- Use with caution as it interfaces with your system's input stack
- **May cause input freezes on your computer**
- For testing purposes only

## Prerequisites

- [Gamepad_API](https://github.com/Aileck/Gamepad_API) library
- [ViGEmBus Driver](https://github.com/ViGEm/ViGEmBus/releases) installed
- Node.js and npm

## Usage

1. Launch the application
2. Select the controller type you want to create (Xbox 360 or DualShock 4)
3. Click "Create Controller"
4. Use the virtual controller interface to test button inputs and analog sticks
5. Check your system for the virtual controller device

### Development

```bash
$ npm run dev
```
