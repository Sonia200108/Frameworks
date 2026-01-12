using test.Model;

namespace test.Data
{
    public class NieuwsberichtRepository
    {
        private Dictionary<int, Nieuwsbericht> berichten;
        private int idTeller;

        public NieuwsberichtRepository()
        {
            berichten = new Dictionary<int, Nieuwsbericht>();
            idTeller = 0;
        }

        public IEnumerable<Nieuwsbericht> messages
        {
            get { return berichten.Values; }
        }

        public Nieuwsbericht this[int id]
        {
            get { return berichten[id]; }
        }

        internal Nieuwsbericht Add(Nieuwsbericht nieuwsbericht)
        {
            idTeller++;
            nieuwsbericht.Id = idTeller;
            berichten[idTeller] = nieuwsbericht;
            return nieuwsbericht;
        }

        internal void Update(Nieuwsbericht nieuwsbericht)
        {
            berichten[(int)nieuwsbericht.Id] = nieuwsbericht;
        }
        internal bool IdExists(int id)
        {
            return berichten.ContainsKey(id);
        }

        internal void Delete(int id)
        {
            berichten.Remove(id);
        }
    }
}
