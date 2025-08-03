using Newtonsoft.Json;

namespace PropVivo.Domain.Common
{
    public abstract class DocumentBase
    {
        public DocumentBase()
        {
            DocumentType = GetType().Name;
        }

        [JsonProperty("documentType")]
        public string DocumentType { get; private set; }

        public void SetCustomDocumentType(string type)
        {
            DocumentType = type;
        }
    }
}