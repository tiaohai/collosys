﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Domain;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;

#endregion


namespace ColloSys.QueryBuilder.ClientDataBuilder
{
    public class CUnbilledBuilder : QueryBuilder<CUnbilled>
    {
        public override QueryOver<CUnbilled, CUnbilled> WithRelation()
        {
            return QueryOver.Of<CUnbilled>();
        }

        [Transaction]
        public List<object[]> OnFileDate(DateTime fileDate)
        {
            return (List<object[]>) SessionManager.GetCurrentSession().QueryOver<CUnbilled>()
                                        .Where(x => x.FileDate == fileDate)
                                        .SelectList(list => list.SelectGroup(m => m.AccountNo).SelectSum(m => m.UnbilledAmount))
                                        .List<object[]>();
        }
    }
}