<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

$sender_id = $_SESSION['user_id'];

// Get sender's info
$sender_query = "SELECT username, balance FROM users WHERE id = $sender_id";
$sender_result = mysqli_query($conn, $sender_query);
$sender_data = mysqli_fetch_assoc($sender_result);
$sender_username = $sender_data['username'];
$sender_balance = $sender_data['balance'];

$message = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $receiver_username = $_POST['receiver']; // vulnerable input
    $amount = floatval($_POST['amount']);

    if ($receiver_username == $sender_username) {
        $message = "❌ Cannot transfer to yourself.";
    } elseif ($amount <= 0) {
        $message = "❌ Enter a valid amount.";
    } elseif ($amount > $sender_balance) {
        $message = "❌ Insufficient balance.";
    } else {
        // 💀 Deliberately vulnerable to SQL Injection
        $receiver_query = "SELECT id, username, balance FROM users WHERE username = '$receiver_username';";

        if (mysqli_multi_query($conn, $receiver_query)) {
            do {
                if ($result = mysqli_store_result($conn)) {
                    $receiver_data = mysqli_fetch_assoc($result);
                    mysqli_free_result($result);
                }
            } while (mysqli_more_results($conn) && mysqli_next_result($conn));

            if (!empty($receiver_data)) {
                $receiver_id = $receiver_data['id'];
                $receiver_actual_username = $receiver_data['username'];
                $receiver_balance = $receiver_data['balance'];

                $new_sender_balance = $sender_balance - $amount;
                $new_receiver_balance = $receiver_balance + $amount;

                // Transfer balance
                mysqli_query($conn, "UPDATE users SET balance = $new_sender_balance WHERE id = $sender_id");
                mysqli_query($conn, "UPDATE users SET balance = $new_receiver_balance WHERE id = $receiver_id");

                // Log transaction
                mysqli_query($conn, "INSERT INTO transactions (sender, receiver, amount) 
                                     VALUES ('$sender_username', '$receiver_actual_username', $amount)");

                $message = "✅ ₹$amount transferred to $receiver_actual_username";
                $sender_balance = $new_sender_balance;
            } else {
                $message = "❌ Receiver not found.";
            }
        } else {
            // 🛑 This will catch SQL errors or malicious injection issues
            $message = "❌ SQL Error: " . mysqli_error($conn);
        }
    }
}
?>



<!DOCTYPE html>
<html>
<head>
    <title>Transfer Money</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(120deg, #ff758c, #ff7eb3);
            color: white;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 80px auto;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        h2 {
            text-align: center;
            margin-bottom: 30px;
        }
        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 12px;
            margin: 10px 0 20px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
        }
        input[type="submit"] {
            background-color: #ffffff;
            color: #ff4081;
            border: none;
            padding: 14px;
            font-size: 16px;
            width: 100%;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
        }
        .message {
            text-align: center;
            margin-top: 20px;
            font-weight: bold;
        }
        .back {
            text-align: center;
            margin-top: 25px;
        }
        .back a {
            color: #ffe9e9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>💸 Transfer Money</h2>
        <p><strong>Balance:</strong> ₹<?php echo $sender_balance; ?></p>
        <form method="post">
            <label>Receiver Username:</label>
            <input type="text" name="receiver" required placeholder="Enter recipient username">

            <label>Amount (₹):</label>
            <input type="number" name="amount" step="0.01" required placeholder="Enter amount">

            <input type="submit" value="Send Money">
        </form>

        <?php if ($message): ?>
            <div class="message"><?php echo $message; ?></div>
        <?php endif; ?>

        <div class="back">
            <a href="dashboard.php">⬅️ Back to Dashboard</a>
        </div>
    </div>
</body>
</html>

