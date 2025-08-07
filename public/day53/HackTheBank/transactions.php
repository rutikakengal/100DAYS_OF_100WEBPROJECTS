<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

// Fetch logged-in user's username
$user_id = $_SESSION['user_id'];
$user_query = "SELECT username FROM users WHERE id = $user_id";
$user_result = mysqli_query($conn, $user_query);
$user = mysqli_fetch_assoc($user_result);
$username = $user['username'];

// Intentionally open query (simulate poor security)
$query = "SELECT * FROM transactions ORDER BY timestamp DESC";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    echo "✅ Data found!<br>";
} else {
    echo "⚠️ No transactions found.<br>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Transaction History</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(130deg, #00c6ff, #0072ff);
            color: white;
            margin: 0;
            padding: 0;
        }
        .container {
            margin: 50px auto;
            width: 90%;
            max-width: 800px;
            background: rgba(255, 255, 255, 0.07);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        h2 {
            text-align: center;
            margin-bottom: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            color: white;
        }
        th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        th {
            background-color: rgba(255, 255, 255, 0.1);
        }
        tr:hover {
            background-color: rgba(255,255,255,0.1);
        }
        .income {
            color: #b3ffb3;
        }
        .outgoing {
            color: #ffcccc;
        }
        a {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #ffe0e0;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>📄 Transaction History</h2>
        <table>
            <tr>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount (₹)</th>
                <th>Date & Time</th>
            </tr>

            <?php while($row = mysqli_fetch_assoc($result)) { ?>
                <tr>
                    <td class="<?php echo ($row['sender'] == $username) ? 'outgoing' : ''; ?>">
                        <?php echo htmlspecialchars($row['sender']); ?>
                    </td>
                    <td class="<?php echo ($row['receiver'] == $username) ? 'income' : ''; ?>">
                        <?php echo htmlspecialchars($row['receiver']); ?>
                    </td>
                    <td>₹<?php echo $row['amount']; ?></td>
                    <td><?php echo $row['timestamp']; ?></td>
                </tr>
            <?php } ?>
        </table>

        <a href="dashboard.php">⬅️ Back to Dashboard</a>
    </div>
</body>
</html>

