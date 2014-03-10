﻿using ColloSys.DataLayer.Domain;
using ColloSys.QueryBuilder.BaseTypes;
using NHibernate;
using NHibernate.Criterion;
using NHibernate.Transform;

namespace ColloSys.QueryBuilder.StakeholderBuilder
{
    public class StakeWorkingQueryBuilder : QueryBuilder<StkhWorking>
    {
        public override QueryOver<StkhWorking,StkhWorking> DefaultQuery()
        {
            return QueryOver.Of<StkhWorking>()
                            .Fetch(x => x.Stakeholder).Eager
                            .Fetch(x => x.StkhPayment).Eager
                            .TransformUsing(Transformers.DistinctRootEntity);
        }
    }
}