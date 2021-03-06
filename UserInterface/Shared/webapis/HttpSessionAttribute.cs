﻿using System;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ColloSys.DataLayer.SessionMgr;
using NHibernate;

namespace AngularUI.Shared.webapis
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class HttpSession2Attribute : ActionFilterAttribute
    {
        protected ISession Session { get; private set; }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Session = SessionManager.BindNewSession();
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            SessionManager.UnbindSession();
        }

    }
}