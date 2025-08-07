<?php
session_start();
include 'db.php';

// If user is not logged in, redirect to login page
if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

// Fetch user data
$user_id = $_SESSION['user_id'];
$query = "SELECT username, balance FROM users WHERE id = $user_id";
$result = mysqli_query($conn, $query);
$user = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Bank Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(120deg, #1e3c72, #2a5298);
            color: #fff;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .card {
            background-color: #ffffff20;
            padding: 30px;
            margin: auto;
            border-radius: 20px;
            max-width: 500px;
            box-shadow: 0 0 20px #00000030;
        }
        h1 {
            font-size: 2.5em;
        }
        .balance {
            font-size: 1.8em;
            margin: 20px 0;
            color: #00ffcc;
        }
        .actions a {
            display: inline-block;
            margin: 10px;
            padding: 12px 25px;
            border-radius: 10px;
            background-color: #00c3ff;
            color: white;
            text-decoration: none;
            transition: 0.3s ease;
        }
        .actions a:hover {
            background-color: #008fce;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Welcome, <?php echo $user['username']; ?> 👋</h1>
        <div class="balance">💰 Balance: ₹<?php echo $user['balance']; ?></div>

        <div class="actions">
            <a href="transfer.php">🔄 Transfer Money</a>
            <a href="transactions.php">🪪 View Transactions</a>
            <a href="hacker_view.php">💣 Try SQL Injection</a>
            <a href="logout.php">🚪 Logout</a>
        </div>
    </div>
</body>
</html>
