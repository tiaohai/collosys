﻿#region references

using System;
using System.Collections.Generic;
using ColloSys.DataLayer.Generic;
using ColloSys.DataLayer.SessionMgr;
using ColloSys.QueryBuilder.BaseTypes;
using ColloSys.QueryBuilder.TransAttributes;
using NHibernate.Criterion;
using NHibernate.Transform;

#endregion

namespace ColloSys.QueryBuilder.GenericBuilder
{
    public class GPermissionBuilder : Repository<GPermission>
    {
        [Transaction]
        public IEnumerable<GPermission> OnHierarchyId(Guid hierarchyId)
        {
            return SessionManager.GetCurrentSession().QueryOver<GPermission>()
                                 .Where(x => x.Role.Id == hierarchyId)
                                 .Fetch(x => x.Role).Eager
                                 .TransformUsing(Transformers.DistinctRootEntity)
                                 .List();
        }

        public override QueryOver<GPermission, GPermission> ApplyRelations()
        {
            return QueryOver.Of<GPermission>()
                            .Fetch(x => x.Role).Eager;
        }
    }
}