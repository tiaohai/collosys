﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using ColloSys.DataLayer.Billing;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.SharedDomain;
using NLog;

namespace BillingService.ViewModel
{
    public static class ExpressionBuilder
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        #region where Condition Expression

        public static Expression<Func<T, bool>> GetConditionExpression<T>(ScbEnums.Products products, List<BCondition> bConditions, List<T> data)
        {
            var parameter = Expression.Parameter(typeof(T), "x");
            Expression expression = null;

            for (var i = 0; i < bConditions.Count; i++)
            {
                var bCondition = bConditions[i];
                expression = (expression == null)
                                 ? GetConditionExpression(parameter, products, bCondition, data)
                                 : Expression.AndAlso(expression, GetConditionExpression(parameter, products, bCondition, data));
            }

            return Expression.Lambda<Func<T, bool>>(expression, parameter);
        }

        private static Expression GetConditionExpression<T>(ParameterExpression parameter, ScbEnums.Products products, BCondition bCondition, List<T> data)
        {
            Expression left = GetLeftExpression(parameter, products, bCondition, data);
            Expression right = GetRightExpression(parameter, bCondition, left.Type);

            switch (bCondition.Operator)
            {
                case ColloSysEnums.Operators.GreaterThan:
                    return Expression.GreaterThan(left, right);

                case ColloSysEnums.Operators.GreaterThanEqualTo:
                    return Expression.GreaterThanOrEqual(left, right);

                case ColloSysEnums.Operators.LessThan:
                    return Expression.LessThan(left, right);

                case ColloSysEnums.Operators.LessThanEqualTo:
                    return Expression.LessThanOrEqual(left, right);

                case ColloSysEnums.Operators.NotEqualTo:
                    return Expression.NotEqual(left, right);

                case ColloSysEnums.Operators.EqualTo:
                    return Expression.Equal(left, right);

                //case ColloSysEnums.Operators.StartsWith:
                //case ColloSysEnums.Operators.EndsWith:
                //case ColloSysEnums.Operators.Contains:
                //case ColloSysEnums.Operators.Like:
                default:
                    throw new ArgumentOutOfRangeException("operators");
            }
        }

        private static Expression GetLeftExpression<T>(ParameterExpression parameter, ScbEnums.Products products, BCondition bCondition, List<T> data)
        {
            switch (bCondition.Ltype)
            {
                case ColloSysEnums.PayoutLRType.None:
                    return null;
                case ColloSysEnums.PayoutLRType.Value:
                    return null;
                case ColloSysEnums.PayoutLRType.Table:
                case ColloSysEnums.PayoutLRType.Column:
                    if (bCondition.LtypeName.IndexOf('.') < 0)
                        return Expression.Property(parameter, bCondition.LtypeName);

                    return PropertyOfProperty(parameter, bCondition.LtypeName);
                case ColloSysEnums.PayoutLRType.Formula:
                    var value = FormulaBuilder.SolveFormula<T>(products, bCondition.LtypeName, data);

                    Logger.Info(string.Format("Product : {0},Formula : {1} give value : {2}", products, bCondition.LtypeName, value));

                    return (value.GetType() == typeof(Expression)) ? value : Expression.Constant(value);
                case ColloSysEnums.PayoutLRType.Matrix:
                    return null;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private static Expression GetRightExpression(ParameterExpression parameter, BCondition bCondition, Type rightType)
        {
            switch (bCondition.Rtype)
            {
                case ColloSysEnums.PayoutLRType.None:
                    return null;
                case ColloSysEnums.PayoutLRType.Value:
                    var value = ConvertToType(bCondition.Rvalue, rightType);
                    return Expression.Constant(value);
                case ColloSysEnums.PayoutLRType.Table:
                case ColloSysEnums.PayoutLRType.Column:
                    return Expression.Property(parameter, bCondition.RtypeName);
                case ColloSysEnums.PayoutLRType.Formula:
                    return null;
                case ColloSysEnums.PayoutLRType.Matrix:
                    return null;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        #endregion

        #region select output expression

        public static decimal GetOutputExpression<T>(ScbEnums.Products products, List<BCondition> bConditions, List<T> data)
        {
            var parameter = Expression.Parameter(typeof(T), "x");

            decimal ouput = 0;
            for (var i = 0; i < bConditions.Count; i++)
            {
                var bCondition = bConditions[i];
                ouput = MathOperation(bCondition.Operator, ouput,
                                      GetOutputExpression(parameter, products, bCondition, data));
            }

            return ouput;
        }

        private static decimal MathOperation(ColloSysEnums.Operators operater, decimal decimal1, decimal decimal2)
        {
            switch (operater)
            {
                case ColloSysEnums.Operators.None:
                case ColloSysEnums.Operators.Plus:
                    return decimal1 + decimal2;
                case ColloSysEnums.Operators.Minus:
                    return decimal1 - decimal2;
                case ColloSysEnums.Operators.Multiply:
                    return decimal1 * decimal2;
                case ColloSysEnums.Operators.Divide:
                    return (decimal2 == 0) ? 0 : decimal1 / decimal2;
                case ColloSysEnums.Operators.ModuloDivide:
                    return (decimal2 == 0) ? 0 : decimal1 % decimal2;
                default:
                    throw new ArgumentOutOfRangeException("operater");
            }
        }

        private static decimal GetOutputExpression<T>(ParameterExpression parameter, ScbEnums.Products products, BCondition bCondition, List<T> data)
        {
            dynamic right = GetRightOutputExpression<T>(parameter, products, bCondition, typeof(decimal), data);

            if (right.GetType() == typeof(decimal))
            {
                return right;
            }

            var expression = Expression.Lambda<Func<T, decimal>>(right, parameter);

            Func<T, decimal> selectExpression = expression.Compile();

            var test = data.Sum(selectExpression);
            switch (bCondition.Lsqlfunction)
            {
                case ColloSysEnums.Lsqlfunction.Sum:
                    return data.Sum(selectExpression);
                case ColloSysEnums.Lsqlfunction.Max:
                    return data.Max(selectExpression);
                case ColloSysEnums.Lsqlfunction.Min:
                    return data.Min(selectExpression);
                case ColloSysEnums.Lsqlfunction.Count:
                    return data.Count();
                case ColloSysEnums.Lsqlfunction.Average:
                    return data.Average(selectExpression);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        private static dynamic GetRightOutputExpression<T>(ParameterExpression parameter, ScbEnums.Products products, BCondition bCondition, Type rightType, List<T> data = null)
        {
            switch (bCondition.Rtype)
            {
                case ColloSysEnums.PayoutLRType.None:
                    return null;
                case ColloSysEnums.PayoutLRType.Value:
                    var value = ConvertToType(bCondition.Rvalue, rightType);
                    return value;
                case ColloSysEnums.PayoutLRType.Table:
                case ColloSysEnums.PayoutLRType.Column:
                    if (bCondition.RtypeName.IndexOf('.') < 0)
                        return Expression.Property(parameter, bCondition.RtypeName);

                    return PropertyOfProperty(parameter, bCondition.RtypeName);
                case ColloSysEnums.PayoutLRType.Formula:
                    var formulaValue = FormulaBuilder.SolveFormula<T>(products, bCondition.RtypeName, data);
                    Logger.Info(string.Format("Product : {0}, Formula : {1} give value : {2}", products, bCondition.RtypeName, formulaValue));
                    return formulaValue;
                case ColloSysEnums.PayoutLRType.Matrix:
                    var matrixValue = MatrixCalulater.CalculateMatrix<T>(products, bCondition.RtypeName, data);

                    Logger.Info(string.Format("Product : {0}, Matrix : {1} give value : {2}", products, bCondition.RtypeName, matrixValue));
                    return matrixValue;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        #endregion

        #region Helper

        private static dynamic ConvertToType(string value, Type type)
        {
            if (type.IsEnum)
            {
                return Enum.Parse(type, value);
            }

            if (type == typeof(decimal))
            {
                return Convert.ToDecimal(value);
            }

            if (type == typeof(int))
            {
                return Convert.ToInt32(value);
            }

            if (type == typeof(uint))
            {
                return Convert.ToUInt32(value);
            }

            if (type == typeof(DateTime))
            {
                return Convert.ToDateTime(value);
            }

            return value;
        }

        private static Expression PropertyOfProperty(Expression expr, string propertyName)
        {
            return propertyName
                       .Split('.')
                       .Aggregate<string, Expression>(
                          expr,
                           (current, property) =>
                               Expression.Property(
                                   current,
                                   GetProperty(current.Type, property)));
        }

        private static PropertyInfo GetProperty(Type type, string propertyName)
        {
            PropertyInfo prop = type.GetProperty(propertyName);
            if (prop == null)
            {
                var baseTypesAndInterfaces = new List<Type>();
                if (type.BaseType != null) baseTypesAndInterfaces.Add(type.BaseType);
                baseTypesAndInterfaces.AddRange(type.GetInterfaces());
                foreach (Type t in baseTypesAndInterfaces)
                {
                    prop = GetProperty(t, propertyName);
                    if (prop != null)
                        break;
                }
            }
            return prop;
        }
        #endregion
    }
}
