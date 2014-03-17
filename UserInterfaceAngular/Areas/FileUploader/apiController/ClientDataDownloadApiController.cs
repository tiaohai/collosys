﻿#region references

using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ColloSys.DataLayer.Enumerations;
using ColloSys.DataLayer.FileUploader;
using ColloSys.DataLayer.Infra.SessionMgr;
using ColloSys.DataLayer.Services.Shared;
using ColloSys.UserInterface.Shared.Attributes;

#endregion

namespace ColloSys.UserInterface.Areas.FileUploader.apiController
{
    public class ClientDataDownloadApiController : ApiController
    {
        [HttpGet]
        [HttpTransaction]
        public HttpResponseMessage FetchProductCategory()
        {
            //System.Threading.Thread.Sleep(10*1000);
            var vm = new ProductCategoryModel
                {
                    Products = Enum.GetNames(typeof(ScbEnums.Products))
                                   .Where(x => x != ScbEnums.Products.UNKNOWN.ToString()),
                    Category = Enum.GetNames(typeof(ScbEnums.Category))
                                   .Where(x => x != ScbEnums.Category.Activity.ToString()),
                    FileDetails = SessionManager.GetCurrentSession()
                                                .QueryOver<FileDetail>()
                                                .List()
                };

            return Request.CreateResponse(HttpStatusCode.OK, vm);
        }

        [HttpPost]
        [HttpTransaction]
        public HttpResponseMessage FetchPageData(DownloadParams downloadParams)
        {
            var data = ClientDataDownloadHelper.GetPageData(downloadParams);
            return Request.CreateResponse(HttpStatusCode.OK, data);
        }
    }
}
