import random as rnd
from random import randint, choice
from datetime import datetime, timedelta, date
female_names = ["Анна", "Мария", "Елизавета", "София", "Анастасия", "Виктория", "Алиса", "Дарья", "Екатерина", "Полина"]
male_names = ["Александр", "Дмитрий", "Максим", "Иван", "Артем", "Николай", "Сергей", "Михаил", "Андрей", "Владимир"]
patronymics_female = ["Александровна", "Дмитриевна", "Максимовна", "Ивановна", "Артемовна", "Николаевна", "Сергеевна", "Михайловна", "Андреевна", "Владимировна"]
patronymics_male = ["Александрович", "Дмитриевич", "Максимович", "Иванович", "Артемович", "Николаевич", "Сергеевич", "Михайлович", "Андреевич", "Владимирович"]
surname = ["Смирнов", "Иванов", "Кузнецов", "Соколов", "Попов", "Лебедев", "Козлов", "Новиков", "Морозов", "Петров"]

dog_nicknames = ["Рекс", "Белла", "Макс", "Луна", "Шарик", "Джесси", "Молли", "Бруно", "Лола", "Джек", "Шэдоу", "Бэйли", "Бобик", "Джеки", "Чарли", "Лайка", "Дэйзи", "Рокки", "Лео", "Мэгги"]

#генерируем пользователей
users=[]
for i in range(1, 6):
    login = 'login'+str(randint(300, 400))
    password = 'test'+str(randint(10, 50))+'!'
    user_data=(
        i,
        login,
        password,
        female_names[randint(0, len(female_names)-1)],
        surname[randint(0, len(surname)-1)]+'a',
        patronymics_female[randint(0, len(patronymics_female)-1)]
    )
    users.append(user_data)
    print(f'INSERT INTO "user" (id, login, password, name, surname, patronymic) VALUES '
          f"({user_data[0]}, '{user_data[1]}', '{user_data[2]}', '{user_data[3]}', '{user_data[4]}', '{user_data[5]}');")
    
for i in range(6, 11):
    login = 'login'+str(randint(300, 400))
    password = 'test'+str(randint(10, 50))+'!'
    user_data=(
        i,
        login,
        password,
        male_names[randint(0, len(male_names)-1)],
        surname[randint(0, len(surname)-1)],
        patronymics_male[randint(0, len(patronymics_male)-1)]
    )
    users.append(user_data)
    print(f'INSERT INTO "user" (id, login, password, name, surname, patronymic) VALUES '
          f"({user_data[0]}, '{user_data[1]}', '{user_data[2]}', '{user_data[3]}', '{user_data[4]}', '{user_data[5]}');")
    

dog_breeds = [
    "Лабрадор ретривер",
    "Немецкая овчарка",
    "Бультерьер",
    "Бигль",
    "Ши-тцу",
    "Джек-рассел терьер",
    "Чихуахуа",
    "Пудель",
    "Доберман",
    "Сибирский хаски",
    "Ротвейлер",
    "Австралийская овчарка",
    "Йоркширский терьер",
    "Боксер",
    "Померанский шпиц",
    "Американский стаффордширский терьер",
    "Родезийский риджбек",
    "Шарпей",
    "Шиба-ину",
    "Колли",
    "Далматин",
    "Бельгийский малинуа",
    "Чау-чау",
    "Американский бульдог",
    "Бордер колли",
    "Швейцарская овчарка",
    "Ирландский сеттер",
    "Афганская борзая",
    "Папильон",
    "Бивер-йорк",
    "Японсикй хин",
    "Шотландский терьер",
    "Французский бульдог",
    "Джек-чихуахуа",
    "Ирландский волкодав",
    "Датский дог",
    "Кавказская овчарка",
    "Такса",
    "Пекинес",
    "Русская борзая",
    "Другое"
]
breeds = []
i = 0
for b in dog_breeds:
    breeds.append((i, b))
    print(f'INSERT INTO "breed" (id, name) VALUES '
          f"({i}, '{b}');")
    i+=1


criterion = [(1, 'Внешний вид'), (2, 'Стойка'), (3, 'Движение'), (4, 'Здоровье'), (5, 'Соответствие породе')]
for c in criterion:
    print(f'INSERT INTO "criterion" (id, name) VALUES '
          f"({c[0]}, '{c[1]}');")
reward =[(1, 'Золотая медаль'), (2, 'Серебряная медаль'), (3, 'Бронзовая медаль')]
for r in reward:
    print(f'INSERT INTO "reward" (id, name) VALUES '
          f"({r[0]}, '{r[1]}');")
    
dogs =[]

def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = rnd.randint(0, delta.days)
    return start_date + timedelta(days=random_days)
start_date = datetime(1970, 1, 1)
end_date = datetime(2024, 3, 5)



# Generate a random date
random_date = random_date(start_date, end_date)
for i in range(1, 16):
    
    start_date = datetime(1970, 1, 1)
    end_date = datetime(2024, 3, 5)
    dog_data = (
        i,
        dog_nicknames[randint(0, len(dog_nicknames)-1)],
        randint(1, 15),
        randint(1, 10),
        randint(0, 39),
        (datetime.now() - timedelta(days=randint(1, 365 * 5))).replace(hour=0, minute=0, second=0, microsecond=0)
    )
    dogs.append(dog_data)
    print(f'INSERT INTO "dog" (id, name, age, user_id, breed_id, vaccination) VALUES '
          f"({dog_data[0]}, '{dog_data[1]}', '{dog_data[2]}', '{dog_data[3]}', '{dog_data[4]}', '{dog_data[5]}');")