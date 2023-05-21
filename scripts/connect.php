<?php
    try {  
        $DBH = new PDO("sqlite:../BD.db");  
      }  
      catch(PDOException $e) {  
          echo $e->getMessage();  
      }
?>