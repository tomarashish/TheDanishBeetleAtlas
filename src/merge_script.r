getwd()
setwd("DanskBilleKatelog/")

df1 = read.csv("BillekatalogSamlet.csv", header = T)
df2 = read.csv("StednavneExxel.csv", header = T)

df.new = merge(df1, df2, by=c("Lokalitet", "Distrikt"), all.x = T)
write.csv(df.new, file="merge_data.csv", row.names = FALSE)