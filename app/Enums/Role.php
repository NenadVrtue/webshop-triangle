<?php
// app/Enums/Role.php
namespace App\Enums;

enum Role: int
{
    case User = 0;
    case Admin = 1;
    case Sales = 2;
}
