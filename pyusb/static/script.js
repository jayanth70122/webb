let port;
let writer;

document.getElementById('connectBtn').addEventListener('click', async () => {
    try {
        // Request a port and open a connection
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        document.getElementById('status').innerText = "Status: Connected to Micro:bit";

        // Create a writer to send data to the micro:bit
        const encoder = new TextEncoderStream();
        encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();

        // Enable the upload button once connected
        document.getElementById('uploadBtn').disabled = false;
    } catch (error) {
        console.error('There was an error connecting to the micro:bit:', error);
        document.getElementById('status').innerText = "Status: Connection failed";
    }
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('hexFile');
    if (!fileInput.files.length) {
        alert('Please select a hex file first');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        const hexData = event.target.result;

        try {
            // Write the hex data to the micro:bit
            await writer.write(hexData);
            document.getElementById('status').innerText = "Status: Program uploaded successfully";
        } catch (error) {
            console.error('There was an error uploading the program to the micro:bit:', error);
            document.getElementById('status').innerText = "Status: Upload failed";
        }
    };

    reader.readAsText(file);
});
