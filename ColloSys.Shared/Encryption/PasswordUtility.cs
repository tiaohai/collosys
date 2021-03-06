﻿using System;
using System.Security.Cryptography;
using System.Text;

namespace ColloSys.Shared.Encryption
{
    public static class PasswordUtility
    {
        public static string EncryptText(string password)
        {
            return Convert.ToBase64String(MD5.Create()
                      .ComputeHash(Encoding.UTF8.GetBytes(password))
                );
        }

        public static bool DoMatch(string password, string encryptedText)
        {
            var hash = EncryptText(password);
            return hash == encryptedText;
        }
    }
}
