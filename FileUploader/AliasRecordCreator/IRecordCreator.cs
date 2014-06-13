using System.Collections.Generic;
using ColloSys.DataLayer.Domain;
using ColloSys.FileUploader.RowCounter;
using ReflectionExtension.ExcelReader;

namespace ColloSys.FileUploaderService.AliasRecordCreator
{
    public interface IAliasRecordCreator<in TEntity> where TEntity : class, new()
    {
        FileScheduler FileScheduler { get; }

        bool ComputedSetter(TEntity obj, IExcelReader reader, ICounter counter);

        bool ComputedSetter(TEntity obj, TEntity yobj, IExcelReader reader,
            IEnumerable<FileMapping> mapplings);

        bool CheckBasicField(IExcelReader reader, ICounter counter);

        bool IsRecordValid(TEntity record,ICounter counter);
    }
}